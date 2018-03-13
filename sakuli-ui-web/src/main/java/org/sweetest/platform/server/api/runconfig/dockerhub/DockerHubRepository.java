package org.sweetest.platform.server.api.runconfig.dockerhub;

public class DockerHubRepository {
    private String user;
    private String name;
    private String namespace;
    private String repository_type;
    private Long status;
    private String description;
    private boolean is_private;
    private boolean is_automated;
    private boolean can_edit;
    private Long star_count;
    private Long pull_count;
    private String last_updated;

    public String getNamespacedName() {
        return String.format("%s/%s", getNamespace(), getName());
    }

    public void setNamespacedName(String namespacedName) {
        String[] parts = namespacedName.split("/");
        if(parts.length == 2) {
            this.setNamespace(parts[0]);
            this.setName(parts[1]);
        } else {
            throw new IllegalArgumentException(namespacedName + " is not in format :namespace/:name");
        }
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public String getRepository_type() {
        return repository_type;
    }

    public void setRepository_type(String repository_type) {
        this.repository_type = repository_type;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isIs_private() {
        return is_private;
    }

    public void setIs_private(boolean is_private) {
        this.is_private = is_private;
    }

    public boolean isIs_automated() {
        return is_automated;
    }

    public void setIs_automated(boolean is_automated) {
        this.is_automated = is_automated;
    }

    public boolean isCan_edit() {
        return can_edit;
    }

    public void setCan_edit(boolean can_edit) {
        this.can_edit = can_edit;
    }

    public Long getStar_count() {
        return star_count;
    }

    public void setStar_count(Long star_count) {
        this.star_count = star_count;
    }

    public Long getPull_count() {
        return pull_count;
    }

    public void setPull_count(Long pull_count) {
        this.pull_count = pull_count;
    }

    public String getLast_updated() {
        return last_updated;
    }

    public void setLast_updated(String last_updated) {
        this.last_updated = last_updated;
    }
}
