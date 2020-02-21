package users;

import javax.ejb.Local;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Local
public interface UsersService extends Serializable {

    UserEntity getUser(long userId);
    UserEntity findUser(@NotNull String username);

    UserEntity createUser(@NotNull @Size(min = 2) @NotBlank String username, @NotNull @NotBlank String password);
    boolean removeUser(@NotNull UserEntity user);

    boolean checkPassword(@NotNull UserEntity user, @NotNull String password);
}
