package api.v1.history;

import api.v1.auth.AuthenticatedUser;
import api.v1.auth.Secured;
import history.HistoryService;
import history.QueryEntity;
import users.UserEntity;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Secured
@Path("/history")
@Produces(MediaType.APPLICATION_JSON)
public class HistoryController {

    private final HistoryService service;

    private final UserEntity authenticatedUser;

    @Deprecated
    public HistoryController() {
        service = null;
        authenticatedUser = null;
    }

    @Inject
    public HistoryController(HistoryService service, @AuthenticatedUser UserEntity authenticatedUser) {
        this.service = service;
        this.authenticatedUser = authenticatedUser;
    }

    @GET
    @Path("/get")
    public List<QueryDto> get() {
        return Objects.requireNonNull(service).getQueries(Objects.requireNonNull(authenticatedUser)).stream()
                .map(this::entityToDto).collect(Collectors.toList());
    }

    private QueryDto entityToDto(QueryEntity entity) {
        return new QueryDto(
                entity.getX(),
                entity.getY(),
                entity.getR(),
                entity.getResult()
        );
    }
}
