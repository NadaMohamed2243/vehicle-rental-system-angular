import { Component, ElementRef, OnInit, ViewChild, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('carContainer') carContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private carModel!: THREE.Object3D;
  private controls!: any;
  private animationId!: number;
  private isBrowser: boolean;
  private THREE: typeof THREE | null = null;
  private GLTFLoader: any = null;
  private OrbitControls: any = null;

  cars = [

    {
      name: 'Peugeot 2008',
      modelPath: 'models/peugeot_e-2008.glb',
      scale: { x: 3.5, y: 3.5, z: 3.1 },
      position: { y: -0.3 },
      rotationSpeed: 0.004
    },
    {
      name: 'Peugeot Expert',
      modelPath: 'models/peugeot_expert.glb',
      scale: { x: 3, y: 3, z: 2.7 },
      position: { y: -0.7 },
      rotationSpeed: 0.003
    },    {
      name: 'Ferrari 599 GTO',
      modelPath: 'models/ferrari_599_gto.glb',
      scale: { x: 3.2, y: 3.5, z: 3 },
      position: { y: -0.5 },
      rotationSpeed: 0.005
    }

  ];
  currentCarIndex = 0;
  private currentRotationSpeed = 0.005;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit(): Promise<void> {
    if (this.isBrowser) {
      await this.loadThreeJS();
      this.initThreeJS();
      this.animate();
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.cleanUp();
    }
  }

  private async loadThreeJS(): Promise<void> {
    try {
      this.THREE = await import('three');
      const threeStdlib = await import('three-stdlib');
      this.GLTFLoader = threeStdlib.GLTFLoader;
      this.OrbitControls = threeStdlib.OrbitControls;
    } catch (error) {
      console.error('Error loading Three.js libraries:', error);
    }
  }

  private initThreeJS(): void {
    if (!this.THREE || !this.carContainer) return;

    // Scene setup
    this.scene = new this.THREE.Scene();
    this.scene.background = null;

    // Camera setup
    this.camera = new this.THREE.PerspectiveCamera(
      75,
      this.carContainer.nativeElement.offsetWidth / this.carContainer.nativeElement.offsetHeight,
      0.1,
      1000
    );
    this.camera.position.set(9, 4, 4);

    // Renderer setup
    this.renderer = new this.THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.outputColorSpace = this.THREE.SRGBColorSpace;
    this.renderer.toneMapping = this.THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = this.THREE.PCFSoftShadowMap;

    this.renderer.setSize(
      this.carContainer.nativeElement.offsetWidth,
      this.carContainer.nativeElement.offsetHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.carContainer.nativeElement.appendChild(this.renderer.domElement);

    // Lighting setup
    const ambientLight = new this.THREE.AmbientLight(0xffffff, 2.0);
    this.scene.add(ambientLight);

    const directionalLight = new this.THREE.DirectionalLight(0xffffff, 3.0);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight);

    const fillLight = new this.THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(0, 10, 10);
    this.scene.add(fillLight);

    const hemisphereLight = new this.THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    this.scene.add(hemisphereLight);

    // Car glow light
    const carGlowLight = new this.THREE.PointLight(0x0d6efd, 2, 8);
    carGlowLight.position.set(0, 1, 0);
    this.scene.add(carGlowLight);

    // Controls setup
    this.controls = new this.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.enableRotate = true;
    this.controls.autoRotate = true;
    this.controls.rotateSpeed = 0.10;
    this.controls.minPolarAngle = Math.PI / 2.5;
    this.controls.maxPolarAngle = Math.PI / 2.5;

    this.loadCarModel();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private loadCarModel(): void {
    if (!this.THREE || !this.GLTFLoader) return;

    const currentCar = this.cars[this.currentCarIndex];
    this.currentRotationSpeed = currentCar.rotationSpeed;

    const loader = new this.GLTFLoader();
    loader.load(currentCar.modelPath, (gltf: any) => {
      if (this.carModel) {
        this.scene.remove(this.carModel);
      }

      this.carModel = gltf.scene;
      this.carModel.scale.set(currentCar.scale.x, currentCar.scale.y, currentCar.scale.z);
      this.carModel.position.y = currentCar.position.y;

      if (currentCar.name === 'Peugeot Expert') {
        this.carModel.rotation.y = Math.PI;
      }
      this.carModel.traverse((child: any) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.roughness = 0.2;
            child.material.metalness = 0.9;
            child.material.envMapIntensity = 1.5;
            child.material.needsUpdate = true;
          }
        }
      });

      this.scene.add(this.carModel);
    }, undefined, (error: any) => {
      console.error('Error loading GLTF model:', error);
    });
  }

  private animate(): void {
    if (!this.THREE) return;

    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.controls) {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private onWindowResize(): void {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = this.carContainer.nativeElement.offsetWidth / this.carContainer.nativeElement.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.carContainer.nativeElement.offsetWidth,
      this.carContainer.nativeElement.offsetHeight
    );
  }

  private cleanUp(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.controls) {
      this.controls.dispose();
    }

    window.removeEventListener('resize', () => this.onWindowResize());
  }

  // Car selection methods
  selectCar(index: number): void {
    this.currentCarIndex = index;
    this.loadCarModel();
  }

  nextCar(): void {
    this.currentCarIndex = (this.currentCarIndex + 1) % this.cars.length;
    this.loadCarModel();
  }

  prevCar(): void {
    this.currentCarIndex = (this.currentCarIndex - 1 + this.cars.length) % this.cars.length;
    this.loadCarModel();
  }
}
