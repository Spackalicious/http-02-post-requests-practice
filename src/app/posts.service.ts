import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, map, catchError, throwError, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostsService {
    error = new Subject<string>();

    constructor(
        private http: HttpClient
    ) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content};
        // here will send the HTTP request. This is the code that used to live in app.component.ts 
        this.http.post<{name: string}>(
            'https://ng-complete-guide-e26ee-default-rtdb.firebaseio.com/posts.json',
            postData, 
            {
                observe: 'response'
            }
          )
          .subscribe(responseData => {
            console.log(responseData);
          }, error => {
            this.error.next(error.message);
          });
    
        console.log(postData);
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'key');

        // also send requests - this is from app.component.ts
       return this.http
        // .get<{ [key: string]: Post }>(
        .get(
            'https://ng-complete-guide-e26ee-default-rtdb.firebaseio.com/posts.json',
            {
                headers: new HttpHeaders({'Custom-Header': 'Hello'}), 
                params: searchParams, 
                responseType: 'json'
            }
        )
        .pipe(
            map(responseData=> {
                const postsArray: Post[] = [];
                for (const key in responseData) {
                    if (responseData.hasOwnProperty(key)) {
                    postsArray.push({ ...responseData[key], id: key });
                    }
                }
                return postsArray;
            }), 
            catchError(errorRes => {
                // Send to analytics server or generic error handling task.
                // return throwError(errorRes); //this line is deprecated, of course.
                return throwError(() => errorRes);
            })   
        );
    }

    deletePosts() {
        return this.http
            // .delete('https://ng-complete-guide-e26ee-default-rtdb.firebaseio.com/posts.json');
            .delete('https://ng-complete-guide-e26ee-default-rtdb.firebaseio.com/posts.json', 
            {
                observe: 'events', 
                responseType: 'text'
            }
        ).pipe(tap(event => {
            console.log(event);
            if (event.type === HttpEventType.Sent) {
                console.log("something for the user to know the request was sent... do more with UX!");
            }
            if (event.type === HttpEventType.Response) {
                console.log(event.body);
            }
        }));
    }

}