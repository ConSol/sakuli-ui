import {TEMPPage} from './app.po';

describe('temp App', () => {
  let page: TEMPPage;

  beforeEach(() => {
    page = new TEMPPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getHeaderText()
      .then(msg => expect(msg).toEqual('Login to Sakuli-UI'))
      .then(done, done.fail);
  });
});
