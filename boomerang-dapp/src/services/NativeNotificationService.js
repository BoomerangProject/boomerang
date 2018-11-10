class NativeNotificationService {
  notify(alertMessage) {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(alertMessage);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission((permission) => {
          if (permission === 'granted') {
            new Notification(alertMessage);
          }
        });
      }
    }
  }

  notifyLoginRequest(label) {
    this.notify(`Login requested from ${label.os} from ${label.city}.`);
  }

  notifyReviewRequest(reviewRequest) {
    this.notify(`Review requested from ${reviewRequest.business} about ${reviewRequest.worker}.`);
  }

}

export default NativeNotificationService;
