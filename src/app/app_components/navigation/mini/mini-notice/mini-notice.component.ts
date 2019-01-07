import { Component, AfterViewInit } from "@angular/core";
import { ActivityService, BcAuthService } from "../../../../_services";
import * as $ from "jquery";

@Component({
  selector: "app-mini-notice",
  templateUrl: "./mini-notice.component.html",
  styleUrls: ["./mini-notice.component.scss"]
})
export class MiniNoticeComponent implements AfterViewInit {
  activity: any;
  mode: any;
  unseenActivity: any;

  constructor(
    public activityService: ActivityService,
    public bcAuthService: BcAuthService
  ) {
    this.activityService.setRefs();
    this.bcAuthService.mode.subscribe(mode => {
      this.mode = mode;
    });
  }

  ngAfterViewInit() {
    this.setUnseenActivity();
    this.getActivity();
  }

  getActivity() {
    this.activityService.ActivityList.subscribe(activity => {
      this.activity = activity;
      this.activityService.activity = activity;
      this.checkForUnseen();
    });
  }

  checkForUnseen() {
    const self = this;
    $.each(self.activity, function(index, item) {
      if (!item.seen) {
        self.activityService.setNewActivity(true);
        return false;
      } else {
        self.activityService.setNewActivity(false);
      }
    });
  }

  setUnseenActivity() {
    const bell = document.getElementById("herE");
    this.activityService.getNewActivity().subscribe(unseenActivity => {
      this.unseenActivity = unseenActivity;
      if (bell && unseenActivity) {
        bell.classList.add("ring-bell");
      } else if (bell) {
        bell.classList.remove("ring-bell");
      }
    });
  }

  markAllSeen() {
    $.each(this.activity, function(index, item) {
      this.markItemSeen(item);
    });
  }

  markItemSeen(item) {
    item.seen = true;
    this.activityService.updateActivity(item);
  }
}
