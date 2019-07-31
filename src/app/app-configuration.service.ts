import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfiguration {
  constructor(private httpClient: HttpClient) {

  }
  title: string;
  apiUrl: string;

  ensureInit(): Promise<any> {
    return new Promise((r, e) => {
      // mock because can't xhr local file here
      const content = {
        title : 'Clinic +',
        apiUrl : 'http://test.api.com'
      };
      Object.assign(this, content);
      r(content);

      // real code
      /*
      this.httpClient.get("./config/config.json")
        .subscribe(
        (content: AppConfiguration) => {
          Object.assign(this, content);
          r(this);
        },
        reason => e(reason));*/
    });
  }
}
