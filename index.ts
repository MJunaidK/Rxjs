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

/*
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
======================================== */

/*
//Making AJAX Requests with RxJS

import {ajax} from 'rxjs/ajax';
import {fromEvent} from 'rxjs';

let button = document.getElementById('readersButton');
fromEvent(button, 'click') // first observable will produce click events from the button
        .subscribe( event => {
            // If you like recieving the data wrapped in observables you can use ajax functions 
            // ajax function return observables
            ajax('/api/readers')        // Second observable will produce HTTPResponse
                .subscribe(ajaxResponse => {
                    console.log(ajaxResponse);
                    let readers = ajaxResponse.response;
                    let readerDiv = document.getElementById('readers');
            
                 for(let reader of readers){
                     readerDiv.innerHTML += reader.name + '<br>';
                    }
            })
        });

=========================================== */

/*
//Module 4
// Understanding Observers


// Observable implements observer interface
// One way to create observer is to create an object literal that implements the methods on the observer interface.

import {Observable,of} from 'rxjs';

// Observer Object
let myObserver = {
    next: value => console.log(`Value produced: ${value}`),
    error: err => console.log(`Error: ${err}`),
    complete: () => console.log('All done producing values')
};

let sourceObservable$ = of(1,3,5);
sourceObservable$.subscribe(myObserver); //passing object literal with three functions to subscribe method

// You can also pass the callback functions directly to subscribe
// subscribing with callbacks, no need to name these and an observer is create behind the scene for you.

let sourceObservable1$ = of(2,4,6);
sourceObservable1$.subscribe(
    value => console.log(`Value produced: ${value}`),
    err => console.log(`Error: ${err}`),
    () => console.log('All done producing values')
);

// Observers vs Subscribers
//public abstract class Subscriber<T> implements Observer<T>, Subscription
//So a Subscriber is an implementation of the Observer, with additional semantics on subscription (it's more about un-subscription)

let myNumbers = [7,8,9];

// Subscriber push values to the observers by calling next, error, complete
// Here observer produce values for an observable
let numberObservables$ = new Observable( susbscriber => {

    if(myNumbers.length === 0) {
        susbscriber.error('No values');
    }

    for(let num of myNumbers){
        susbscriber.next(num);
    }

    susbscriber.complete();    

});

// When you subscribe to the observable, observer used to recieve value

let myObserver1 = {
    next: value => console.log(`Value produced: ${value}`),
    error: err => console.log(`Error: ${err}`),
    complete: () => console.log('All done producing values')
}

numberObservables$.subscribe(myObserver1);

================================================== */
/*

// Creating and Using Observers

import {from} from 'rxjs';
import {allBooks} from './data';

let books$ = from(allBooks);


// let bookObserver = {
//     next: book => console.log(`Value produced: ${book.title}`),
//     error: err => console.log(`Error: ${err}`),
//     complete: () => console.log('All done producing values')
// };

books$.subscribe(
    book => console.log(`Value produced: ${book.title}`),
    err => console.log(`Error: ${err}`),
    () => console.log('All done producing values')
);

==================================================== */
/*

// Multiple Observers Executing a Single Observable

import {Observable} from 'rxjs';

let currentTime$ = new Observable( subscriber  => {
    const timeString = new Date().toLocaleTimeString();
    subscriber.next(timeString);
    subscriber.complete();
});

currentTime$.subscribe(
    currentTime => console.log(` Observer 1: ${currentTime}`)
);

setTimeout(() => {
    currentTime$.subscribe(
        currentTime => console.log(` Observer 2: ${currentTime}`)
    ); 
  }, 1000);

  setTimeout(() => {
    currentTime$.subscribe(
        currentTime => console.log(` Observer 3: ${currentTime}`)
    ); 
  }, 2000);

  ======================================================= */

 /* 
  // Cancelling Observable Execution with a Subscription

  import {interval, fromEvent, Observable, Subscriber} from 'rxjs';
  let timesDiv = document.getElementById('times');
  let button = document.getElementById('timerButton');

  // interval is a built in function and will return an observable that produces atream of integers

 // let timer$ = interval(1000);


 // creating observable like below will return a function that will take care of cleaning and releasing resource once it quit executing.
 let timer$ = new Observable(subscriber => {
     let i=0;
     let intervalID = setInterval(() => {
        subscriber.next(i++);
     }, 1000);

     return () => {
         console.log('Executing teardown code.');
         clearInterval(intervalID);
     }
 });

  // subscribe method returns a Subscription object

  let timerSubscription = timer$.subscribe(
      value => timesDiv.innerHTML += `${new Date().toLocaleTimeString()} (${value}) <br>`,
      null,
      () => console.log('All Done')
  );

  fromEvent(button, 'click')
    .subscribe(
        event => timerSubscription.unsubscribe()
    );

   // Add one subscription to another and cancel them both with single call to unsubscribe
   
   let timerConsoleSubscription = timer$.subscribe(
       value => console.log(`${new Date().toLocaleTimeString()} (${value})`)
   );

   timerSubscription.add(timerConsoleSubscription);

   ================================================== */

   /*
    // Applying Operators


    // Manually applying an Operator 

    import {of} from 'rxjs';
    import {map,filter} from 'rxjs/operator';


    let source$ = of(1,2,3,4,5);

    let doubler = map(value => value * 2);

    let doubled$ =doubler(source$);

    doubled$.subscribe(
        value => console.log(value)
    );


    // Rxjs v5.5 and before operators exitsed as methods on observable so you use standard dot notations to chain on call to operators

    source$
        .map(value => value * 2)
        .filter(mappedValue => mappedValue > 5)
        .subscribe(
            finalValue  => console.log(finalValue)
        )
    
    
   // Now you accomplish the same by passing the list of operators to a method named pipe

   source$.pipe(
       map(value => value * 2),
       filter(mappedValue => mappedValue > 5)
   )
   .subscribe(
       finalValue => console.log(finalValue)
   )

   ================================================== */

   // Using Operators

   import {mergeMap, filter, tap} from 'rxjs/operators';
   import {ajax} from 'rxjs/ajax'; 

    ajax('/api/books')
        .pipe(
            mergeMap(ajaxResponse => ajaxResponse.response),
            filter(book => book.publicationYear < 1950),
            tap(oldBook => console.log(`Title : ${oldBook.title}`))
        )
        .subscribe(
            finalValue => console.log(finalValue)
        )



