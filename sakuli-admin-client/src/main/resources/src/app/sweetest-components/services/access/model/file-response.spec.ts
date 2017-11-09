import {fileResponseFromPath} from "./file-response.interface";

describe(fileResponseFromPath.name, () => {

  it('should create a file response as file', () => {
    const fr = fileResponseFromPath('a/b/c/d.js');
    expect(fr.name).toBe('d.js');
    expect(fr.directory).toBe(false);
    expect(fr.path).toBe('a/b/c');
  })

  it('should create a file response as directory', () => {
    const fr = fileResponseFromPath('a/b/c/d');
    expect(fr.name).toBe('d');
    expect(fr.directory).toBe(true);
    expect(fr.path).toBe('a/b/c');
  })

  it('should create a file response as file even on foldername', () => {
    const fr = fileResponseFromPath('a/b/c/Dockerfile', true);
    expect(fr.name).toBe('Dockerfile');
    expect(fr.directory).toBe(false);
    expect(fr.path).toBe('a/b/c');
  })

})
