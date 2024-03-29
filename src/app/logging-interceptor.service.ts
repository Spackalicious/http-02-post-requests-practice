import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs";


export class LoggingInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log('Outgoing request: ');
        console.log(req.url);
        return next.handle(req).pipe(tap(event => {
            console.log(req.headers);
            if (event.type === HttpEventType.Response) {
                console.log('Incoming response: ');
                console.log(event.body);
            }
        }))
    }
}