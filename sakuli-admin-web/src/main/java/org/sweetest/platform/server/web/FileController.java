package org.sweetest.platform.server.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.HandlerMapping;
import org.sweetest.platform.server.api.file.FileModel;
import org.sweetest.platform.server.api.file.FileSystemService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping(FileController.RequestBasePath)
public class FileController {

    final static String RequestBasePath = "/api/files";

    @Autowired
    private FileSystemService fileSystemService;

    private String cleanRequestPathFor(HttpServletRequest request, String _for) {
        return ((String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE))
                .replace(RequestBasePath + _for, "");
    }

    @RequestMapping(value = "ls/**", method = RequestMethod.GET)
    @ResponseBody
    public List<FileModel> getFiles(HttpServletRequest request) {
        String requestPath = cleanRequestPathFor(request, "/ls/");
        return fileSystemService.getFiles(requestPath)
                .filter(FileSystemService.hiddenFiles)
                .map(FileSystemService.toFileModel.apply(requestPath))
                .collect(Collectors.toList());
    }

    @RequestMapping(value="read/**", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity readFile(HttpServletRequest request) {
        String requestPath = cleanRequestPathFor(request, "/read/");
        System.out.println("------> " + requestPath);
        return fileSystemService.readFile(requestPath)
                .map(cnt -> ResponseEntity.ok().body(cnt))
                .orElse(ResponseEntity.notFound().build());
    }

    @RequestMapping(value="write/**", method = RequestMethod.POST, consumes = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public ResponseEntity writeFile(HttpServletRequest request, HttpEntity<String> httpEntity) {
        String requestPath = cleanRequestPathFor(request, "/write/");
        boolean success = fileSystemService.writeFile(requestPath, httpEntity.getBody());
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
