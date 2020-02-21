package sessions;

import users.UserEntity;

import javax.ejb.Local;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

@Local
public interface SessionsService extends Serializable {

    List<String> getSessionTokens(@NotNull UserEntity user);

    String createSession(@NotNull UserEntity user);
    boolean destroySession(@NotNull UserEntity user, @NotNull String token);

    boolean checkSession(@NotNull UserEntity user, @NotNull String token);
}
