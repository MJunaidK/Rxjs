/*
// Instantiating a new Observable

import {Observable} from 'rxjs';
import {allBooks} from './data';

// Subscribe method define what will happen when the observable is executed.
// It prodcues values that are then recieved by the subscriber object provided when we subscribe to the observable.
function subscribe(subscriber){

    for(let book of allBooks){
        subscriber.next(book);
    }
}

//let allBooksObservable$ = new Observable(subscribe);

// Observable takes a subscribe method as parameter
// subscribe method has subscriber as parameter
// subscriber implements observer interface and has next, error and complete function.
// once observable has called erro or complete methid no new values will be produced

let allBooksObservable$ = Observable.create(
//let allBooksObservable$ = new Observable(
    (subscriber) => {

        if(document.title !== 'RxBookTracker'){
            subscriber.error('Incorrect page title. ');
        }

        setTimeout( 
            () => {
                subscriber.complete();     
            },2000);
        
        for(let book of allBooks){
            subscriber.next(book);
        }

        //The subscribe function should return a function that releses any resources.This function automatically exceuted after call to error or complete

        return () => console.log('Executing teardown code');
    }
);


//subscribe to observable and pass the object that will be the subscriber 

allBooksObservable$.subscribe(book => console.log(book.title));


================================ */

/*
// Creating Observables from Existing Data

import {Observable, of, from, fromEvent, concat} from 'rxjs';
import { allReaders, allBooks } from './data';
//of and from used when you want to create observable from some data you alresy have

let source1$ = of('hello', 10, true, allReaders[0].name);

//source1$.subscribe(value => console.log(value));

//Similar to of but instead of passing a bunch of individual values you pass single object that encapsulates a group of values
let source2$ = from(allBooks);
//source2$.subscribe(book => console.log(book.title))

//combine observables
concat(source1$,source2$).subscribe(value => console.log(value));

======================================= */
// Creating Observables to Handle Events

import {Observable, of, from, fromEvent, concat} from 'rxjs';
import { allReaders } from './data';

let button = document.getElementById('readersButton');

// value produced by the observable will be javascript event object
fromEvent(button, 'click')
        .subscribe( event => {
            console.log(event);

            let readerDiv = document.getElementById('readers');
            
            for(let reader of allReaders){
                readerDiv.innerHTML += reader.name + '<br>';
            }

        });

