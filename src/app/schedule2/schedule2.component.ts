import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as moment from 'moment';

interface Game {
  opponent: string;
  team: string;
  gametime: Date;
  home: boolean;
}

@Component({
  selector: 'app-schedule2',
  templateUrl: './schedule2.component.html',
  styleUrls: ['./schedule2.component.scss']
})
export class Schedule2Component implements OnInit {

  gamesCollection: AngularFirestoreCollection<Game>;
  gamesObservable: Observable<Game[]>;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.gamesCollection = this.afs.collection('games');
    this.gamesObservable = this.gamesCollection.valueChanges()
  }

  public toDateString(unixtime: any): string {
    return moment.unix(unixtime.seconds).format('MM/DD/YYYY');
  }

  public toTimeString(unixtime: any): string {
    return moment.unix(unixtime.seconds).format('h:mm A');
  }

}
