package api.v1.auth;

import users.UserEntity;

public class AuthenticationEvent {

    public final UserEntity user;

    AuthenticationEvent(UserEntity user) {
        this.user = user;
    }
}
