package history;

import users.UserEntity;

import javax.ejb.Local;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

@Local
public interface HistoryService extends Serializable {

    List<QueryEntity> getQueries(UserEntity user);

    boolean addQuery(@NotNull QueryEntity query);

    boolean clear(UserEntity user);
}
