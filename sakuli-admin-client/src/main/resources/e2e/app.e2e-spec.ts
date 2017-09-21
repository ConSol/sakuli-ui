import { TEMPPage } from './app.po';

describe('temp App', () => {
  let page: TEMPPage;

  beforeEach(() => {
    page = new TEMPPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
