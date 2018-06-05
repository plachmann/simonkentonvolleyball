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
import { Observable, of } from 'rxjs';
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

  events$: Observable<Array<CalendarEvent<{ game: Game }>>>;

  eventsForGames$: Observable<Array<CalendarEvent<{ game: Game }>>>;

  activeDayIsOpen = false;

  // new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);

  events: CalendarEvent[] = [
    /*empty array is filled with firestore data */
  ];


  constructor(private http: HttpClient, private afs: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents(): void {
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
  }

  private addEventToArray(newEvent: any) {
    console.log('adding event');
    const t = new Date(newEvent.gametime.seconds * 1000);
    this.events.push({ title: newEvent.opponent, start: t, color: colors.blue, meta: { newEvent } });
    console.log(this.events);
  }

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

  handleEvent(action: string, event: CalendarEvent): void {
    action = (action === 'Clicked') ? 'edit' : action;
    // this.modalData = {event, action};
    const url = this.router.createUrlTree(['/', { outlets: { popup: event.meta.entity + '/' + event.meta.id + '/' + action } }]);
    this.router.navigateByUrl(url.toString());
  }


}
