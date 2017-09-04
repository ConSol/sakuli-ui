package org.sweetest.platform.server.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.HandlerMapping;
import org.sweetest.platform.server.api.file.FileModel;
import org.sweetest.platform.server.api.file.FileSystemService;
import org.sweetest.platform.server.api.project.ProjectService;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping(FileController.RequestBasePath)
public class FileController {

    final static String RequestBasePath = "/api/files";

    @Autowired
    private FileSystemService fileSystemService;

    @Autowired
    private ProjectService projectService;

    private String cleanRequestPathFor(HttpServletRequest request, String _for) {
        return ((String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE))
                .replace(RequestBasePath + _for, "");
    }

    private String cleanRequestPath(HttpServletRequest request) {
        return cleanRequestPathFor(request, "/");
    }

    @GetMapping(value = "ls/**")
    @ResponseBody
    public List<FileModel> getFiles(HttpServletRequest request) {
        String requestPath = cleanRequestPathFor(request, "/ls/");
        return fileSystemService.getFiles(requestPath)
                .filter(FileSystemService.hiddenFiles)
                .map(FileSystemService.toFileModel.apply(requestPath))
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/**")
    @ResponseBody
    public ResponseEntity<Resource> readFile(HttpServletRequest request) {
        String requestPath = cleanRequestPath(request);
        return fileSystemService.readFile(requestPath)
                .map(cnt -> ResponseEntity.ok().body(cnt))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/**")
    @ResponseBody
    public ResponseEntity writeFile(HttpServletRequest request, @RequestParam("file") MultipartFile file) throws IOException {
        String requestPath = cleanRequestPath(request);
        boolean success = fileSystemService.writeFile(requestPath, file.getBytes());
        projectService.readProject(projectService.getActiveProject().getPath())
                .ifPresent(pm -> projectService.setActiveProject(pm));
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @DeleteMapping(value = "/**")
    public ResponseEntity deleteFile(HttpServletRequest request) {
        String requestPath = cleanRequestPath(request);
        boolean success = fileSystemService.deleteFile(requestPath);
        projectService.readProject(projectService.getActiveProject().getPath())
                .ifPresent(pm -> projectService.setActiveProject(pm));
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
