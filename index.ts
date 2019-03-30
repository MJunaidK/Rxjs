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
