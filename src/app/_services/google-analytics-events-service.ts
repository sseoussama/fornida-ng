import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class GoogleAnalyticsEventsService {
  public emitEvent(
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null
  ) {
    (<any>window).ga("send", "event", {
      eventCategory,
      eventLabel,
      eventAction,
      eventValue
    });
  }
}
