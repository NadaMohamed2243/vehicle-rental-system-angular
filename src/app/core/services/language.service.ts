import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLang.asObservable();

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('language') || 'en';
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.currentLang.next(lang);
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  toggleLanguage() {
    const current = this.currentLang.value;
    this.setLanguage(current === 'en' ? 'ar' : 'en');
  }
}
