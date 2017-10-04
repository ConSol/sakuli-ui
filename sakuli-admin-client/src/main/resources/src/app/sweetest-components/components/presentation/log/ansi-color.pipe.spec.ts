import {AnsiColorPipe} from "./ansi-color.pipe";
const strip_ansi = require("strip-ansi");

describe("AnsiColorPipe", () => {

  const pipe = new AnsiColorPipe();

  it('should convert colors', () => {
    const formatted = pipe.transform('\u001B[4mUnicorn\u001B[0m');
    expect(formatted).toEqual('<span class="log-message-4m">Unicorn</span><span class="log-message-0m"></span>')
  });

  it('should do nothing', () => {
    const formatted = strip_ansi('<span>\u001B[0m</span>');
    expect(formatted).toEqual('<span></span>');
  })

});
