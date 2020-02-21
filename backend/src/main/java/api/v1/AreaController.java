package api.v1;

import api.v1.auth.AuthenticatedUser;
import api.v1.auth.Secured;
import area.Area;
import history.HistoryService;
import history.QueryEntity;
import users.UserEntity;

import javax.inject.Inject;
import javax.validation.constraints.NotNull;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.Objects;

@Secured
@Path("/area")
@Produces(MediaType.APPLICATION_JSON)
public class AreaController {

    private final Area service;
    private final HistoryService historyService;

    private final UserEntity authenticatedUser;

    @Deprecated
    public AreaController() {
        this.service = null;
        this.historyService = null;
        this.authenticatedUser = null;
    }

    @Inject
    public AreaController(
            Area service,
            HistoryService historyService,
            @AuthenticatedUser UserEntity authenticatedUser
    ) {
        this.service = service;
        this.historyService = historyService;
        this.authenticatedUser = authenticatedUser;
    }

    @POST
    @Path("/check")
    public boolean checkAndSave(
            @NotNull @FormParam("x") double x,
            @NotNull @FormParam("y") double y,
            @NotNull @FormParam("r") double r
    ) {
        final boolean result = Objects.requireNonNull(service).checkPoint(x, y, r);
        Objects.requireNonNull(historyService)
                .addQuery(new QueryEntity(null, Objects.requireNonNull(authenticatedUser), x, y, r, result));

        return result;
    }
}
