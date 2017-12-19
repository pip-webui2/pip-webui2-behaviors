import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { Router } from "@angular/router";
import { PipThemesService, Theme } from 'pip-webui2-themes';
import { TranslateService } from '@ngx-translate/core';
import { ExmapleListItem } from "./examples-list/shared/examples-list.model";

export const AppTranslations = {
  en: {
    'en': 'English',
    'ru': 'Русский',
    'EXAMPLES.FOCUSABLE_DESCRIPTION': 'allows to navigate over focusable controls using arrow keys',
    'EXAMPLES.PRESS': 'Press',
    'EXAMPLES.TO_CHOOSE_CARD': 'to choose list and',
    'EXAMPLES.TO_CHANGE_FOCUSABLE_ELEMENTS': 'buttons to change focusable elements in list',
    'EXAMPLES.FOCUSABLE_ELEMENT': 'Focusable element',
    'EXAMPLES.SELECTED_DESCRIPTION': 'allows to navigate over non-focuseable elements using arrow keys',
    'EXAMPLES.INFINITE_SCROLL_DESCRIPTION': 'allows to upload data in chunks while user is scrolling',
    'EXAMPLES.DRAGGABLE_DESCRIPTION': 'implements drag & drop functionality'
  },
  ru: {
    'en': 'English',
    'ru': 'Русский',
    'EXAMPLES.FOCUSABLE_DESCRIPTION': 'позволяет перемещаться по фокусируемым элементам управления с помощью клавиш со стрелками',
    'EXAMPLES.PRESS': 'Нажмите',
    'EXAMPLES.TO_CHOOSE_CARD': 'для выбора списка и',
    'EXAMPLES.TO_CHANGE_FOCUSABLE_ELEMENTS': 'кнопки для переключения между фокусируемыми элементами списка',
    'EXAMPLES.FOCUSABLE_ELEMENT': 'Фокусируемый элемент',
    'EXAMPLES.SELECTED_DESCRIPTION': 'позволяет перемещаться по нефокусируемым элементам управления с помощью клавиш со стрелками',
    'EXAMPLES.INFINITE_SCROLL_DESCRIPTION': 'позволяет загружать данные частями во время прокрутки пользователя',
    'EXAMPLES.DRAGGABLE_DESCRIPTION': 'реализации функции перетаскивания (drag&drop)'
  }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  public list: ExmapleListItem[] = [
    {
      name: 'Selected',
      id: 'selected',
      route: 'selected'
    },
    {
      name: 'Focused',
      id: 'focused',
      route: 'focused'
    },
    {
      name: 'Infinite scroll',
      id: 'infinite-scroll',
      route: 'infinite_scroll'
    },
    {
      name: 'Draggable',
      id: 'draggable',
      route: 'draggable'
    }
  ];

  public themesLocalNames: any = {
    "candy-theme": 'Candy',
    "unicorn-dark-theme": 'Unicorn Dark',
    "pip-blue-theme": 'Blue',
    "pip-grey-theme": 'Grey',
    "pip-pink-theme": 'Pink',
    "pip-green-theme": 'Green',
    "pip-navy-theme": 'Navy',
    "pip-amber-theme": 'Amber',
    "pip-orange-theme": 'Orange',
    "pip-dark-theme": 'Dark',
    "pip-black-theme": 'Black',
    "bootbarn-warm-theme": 'Bootbarn Warm',
    "bootbarn-cool-theme": 'Bootbarn Cool',
    "bootbarn-mono-theme": 'Bootbarn Mono'

  }

  public listIndex: number = 0;
  public themes: Theme[];
  public selectedTheme: Theme;
  public activeMediaQuery: boolean;
  public mode: string;
  public app: string = 'Controls';
  public url: string;
  public langs: string[] = [];
  public selectedLang: string = 'en';
  @ViewChild('sidenav') sidenav: MatSidenav;

  public constructor(
    private router: Router,
    private service: PipThemesService,
    public media: ObservableMedia,
    private translate: TranslateService
  ) {

    this.themes = this.service.themes;
    this.selectedTheme = this.service.selectedTheme;

    translate.setDefaultLang(this.selectedLang);
    translate.use(this.selectedLang);
    this.langs = translate.getLangs();
    this.translate.setTranslation('en', AppTranslations.en, true);
    this.translate.setTranslation('ru', AppTranslations.ru, true);

    media.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change && change.mqAlias == 'xs' ? true : false;
      this.mode = change && change.mqAlias == 'xs' ? null : 'side';
    })

    router.events.subscribe((url: any) => {
      let index: number;
      if (!url.url) {
        this.listIndex = 0;
        return;
      }
      if (url.url != this.url) {
        this.url = url.url;
        index = this.list.findIndex((item) => {
          return "/" + item.route == this.url;
        });
        this.listIndex = index == -1 ? 0 : index;
      }
    });

  }

  public ngOnInit() { }

  public ngAfterViewInit() { }

  public changeTheme(theme) {
    this.selectedTheme= theme;
    this.service.selectedTheme = this.selectedTheme;
  }

  public changeLanguage(lang) {
    this.selectedLang = lang;
    this.translate.use(lang);
  }

  public onListItemIndexChanged(index: number) {
    this.listIndex = index;
    this.sidenav.close();
  }

}
