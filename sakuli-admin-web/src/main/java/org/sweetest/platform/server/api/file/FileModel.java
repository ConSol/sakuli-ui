package org.sweetest.platform.server.api.file;

import java.nio.file.Path;

/**
 * Created by timkeiner on 18.07.17.
 */
public class FileModel {

    private String path;
    private String name;
    private String type;
    private boolean isDirectory;

    public FileModel(String path, String name, boolean isDirectory) {
        this.path = path;
        this.name = name;
        this.isDirectory = isDirectory;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isDirectory() {
        return isDirectory;
    }

    public void setDirectory(boolean directory) {
        isDirectory = directory;
    }

    @Override
    public String toString() {
        return "FileModel{" +
                "path='" + path + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", isDirectory=" + isDirectory +
                '}';
    }
}
