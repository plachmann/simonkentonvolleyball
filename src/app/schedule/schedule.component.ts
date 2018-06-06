import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, toArray, mergeMap, switchMap, filter, flatMap, mergeAll, concatAll } from 'rxjs/operators';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  subDays,
  addDays,
  addHours
} from 'date-fns';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { colors } from '../calendar-utils/colors';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Router } from '@angular/router';

interface Film {
  id: number;
  title: string;
  release_date: string;
}
interface Game {
  opponent: string;
  team: string;
  gametime: Date;
  home: boolean;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  gamesRef = this.afs.collection('games');
  gamesObs: Observable<any>;

  view = 'month';
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  eventSubscriber: Subscription;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('edit', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('delete', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent<{ film: Game }>[] = [];
  eventsobj = {
    results: this.events
  };

  activeDayIsOpen = true;
  events$: Observable<Array<CalendarEvent<{ film: Game }>>>;


  constructor(private http: HttpClient, private afs: AngularFirestore, private router: Router) { }

  ngOnInit() {
    // this.fetchEvents();
    console.log('begin populat cal');
    this.populateCalendar();
    console.log('end populat cal');
  }

  /* fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    const params = new HttpParams()
      .set(
        'primary_release_date.gte',
        format(getStart(this.viewDate), 'YYYY-MM-DD')
      )
      .set(
        'primary_release_date.lte',
        format(getEnd(this.viewDate), 'YYYY-MM-DD')
      )
      .set('api_key', '0ec33936a68018857d727958dca1424f');

    this.events$ = of(this.events);

    this.gamesRef = this.afs.collection('games');
    this.gamesObs = this.gamesRef.valueChanges();


    const collection: AngularFirestoreCollection<Game> = this.afs.collection('games')
    const eventsForPhil = collection.valueChanges()
      .pipe(
        tap(res => { console.log('clearing events'); this.events = []; }),
        mergeAll(),
        tap(console.log),
        map(response => {
          this.addEventToArray(response);
        })
      );

    eventsForPhil.subscribe();
  } */

  /* private addEventToArray(newEvent: any) {
    console.log('adding event');
    const t = new Date(newEvent.gametime.seconds * 1000);
    this.events.push({ title: newEvent.opponent, start: t, color: colors.blue, meta: { newEvent } });
    console.log(this.events);
  } */

  dayClicked({
    date,
    events
  }: {
      date: Date;
      events: Array<CalendarEvent<{ film: Film }>>;
    }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ film: Film }>): void {
    window.open(
      `https://www.themoviedb.org/movie/${event.meta.film.id}`,
      '_blank'
    );
  }

  /* from http://www.jhipster-book.com/#!/news/entry/adding-history-to-21-points-health-with-angular-calendar */
  populateCalendar() {
    const monthEnd = endOfMonth(this.viewDate);
    const month = format(monthEnd, 'YYYY-MM');

    let booksCollection: AngularFirestoreCollection<Game>;
    let booksObservable: Observable<Game[]>;

    booksCollection = this.afs.collection('games');
    booksObservable = booksCollection.valueChanges();

    booksObservable.subscribe((response) => {
      response.forEach((item) => {
        this.events.push({
          start: new Date(),
          end: new Date(),
          title: item.team + ': ' + item.opponent,
          color: item.home ? colors.blue : colors.green,
          draggable: false,
          actions: this.actions,
          meta: {
            film: item
          }
        });

      });
      //this.refresh.next();

      console.log(this.events);

      this.events$ = of(this.events)
        .pipe(
          tap(console.log)
        );

      console.log(this.events$);

    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    action = (action === 'Clicked') ? 'edit' : action;
    // this.modalData = {event, action};
    const url = this.router.createUrlTree(['/', { outlets: { popup: event.meta.entity + '/' + event.meta.id + '/' + action } }]);
    this.router.navigateByUrl(url.toString());
  }


}
