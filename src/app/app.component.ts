import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { PipHotkeysService } from 'pip-webui2-behaviors';
import { PipThemesService, Theme } from 'pip-webui2-themes';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExmapleListItem } from './examples-list/shared/ExampleListItem';
import { AppTranslations } from './app.strings';

type ObservableMap<T> = {
  [P in keyof T]: Observable<T[P]>;
};

type ObservableOrAnyMap<T> = {
  [P in keyof T]: Observable<T[P]> | T[P];
};

export function zip<L, R>(arr1: L[], arr2: R[]): [L, R][] {
  return arr1.map((k, i) => [k, arr2[i]]);
}

export function unzip<L, R>(arr: [L, R][]): [L[], R[]] {
  return arr.reduce(([l, r], [a, b]) => [[...l, a], [...r, b]], [[], []]);
}

function combineLatestMap<T>(sources: ObservableOrAnyMap<T>): Observable<T> {
  const obs = {} as ObservableMap<T>;
  const vals: Object = {};
  Object.keys(sources).forEach(k => {
    if (Observable.prototype.isPrototypeOf(sources[k])) {
      obs[k] = sources[k];
    } else {
      vals[k] = sources[k];
    }
  });
  const sourceEntries = Object.entries<Observable<any>>(obs);
  const [sourceKeys, sourceValues] = unzip(sourceEntries);

  return combineLatest(sourceValues).pipe(
    map((values) => Object.assign({} as T, vals, Object.fromEntries(zip(sourceKeys, values))))
  );
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public list: ExmapleListItem[] = [
    {
      name: 'Selectable',
      id: 'selectable',
      route: 'selectable'
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
      name: 'Infinite page',
      id: 'infinite-scroll-page',
      route: 'infinite_page'
    },
    {
      name: 'Draggable',
      id: 'draggable',
      route: 'draggable'
    },
    {
      name: 'Hotkeys',
      id: 'hotkeys',
      route: 'hotkeys'
    }
  ];

  public themes: Theme[];
  public theme: Theme;
  public languages = ['en', 'ru'];
  public language: string;

  public ctx$: Observable<{
    activeMediaQuery: boolean,
    mode: string
  }>;
  public listIndex = 0;
  public selectedTheme: Theme;
  public activeMediaQuery$: Observable<boolean>;
  public mode$: Observable<string>;
  public app = 'Behaviors';
  public url: string;
  public langs: string[] = [];
  public selectedLang = 'en';
  @ViewChild('sidenav') sidenav: MatSidenav;

  public constructor(
    private location: Location,
    private service: PipThemesService,
    public media: MediaObserver,
    private translate: TranslateService,
    private pipHotkeys: PipHotkeysService
  ) {

    this.themes = this.service.themesArray;
    this.theme = this.service.currentTheme;

    this.translate.addLangs(this.languages);
    Object.entries(AppTranslations).forEach(e => this.translate.setTranslation(e[0], e[1], true));
    this.translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|ru/) ? browserLang : 'en');
    this.language = this.translate.currentLang;

    this.activeMediaQuery$ = media.asObservable().pipe((map(changes => changes && changes.some(c => c.mqAlias === 'xs'))));
    this.mode$ = media.asObservable().pipe((map(changes => changes && changes.some(c => c.mqAlias === 'xs') ? null : 'side')));
    this.ctx$ = combineLatest([
      this.activeMediaQuery$,
      this.mode$
    ]).pipe(map(([activeMediaQuery, mode]) => ({ activeMediaQuery, mode })));
    this.ctx$ = combineLatestMap({
      activeMediaQuery: this.activeMediaQuery$,
      mode: this.mode$
    });

    this.pipHotkeys.add({
      hotkey: 'ctrl+alt+l',
      action: () => {
        this.selectedLang = this.selectedLang === 'en' ? 'ru' : 'en';
        this.translate.use(this.selectedLang);
      }
    });
    this.pipHotkeys.add({
      hotkey: 'ctrl+alt+f',
      action: () => { this.onListItemIndexChanged(1); },
      navigationCommand: ['focused']
    });
  }

  public ngOnInit() {
    this.listIndex = Math.max(0, this.list.findIndex((item) => {
      return '/' + item.route === this.location.path();
    }));
  }

  public changeTheme(theme: Theme) {
    this.theme = theme;
    this.service.selectTheme(theme.name);
  }

  public changeLanguage(language: string) {
    this.language = language;
    this.translate.use(language);
  }

  public onListItemIndexChanged(index: number) {
    this.listIndex = index;
    this.sidenav.close();
  }
}
