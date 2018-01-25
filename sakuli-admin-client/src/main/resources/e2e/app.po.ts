import {browser, by, element} from 'protractor';

export class TEMPPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeaderText() {
    return element(by.css('app-root h4')).getText();
  }
}
