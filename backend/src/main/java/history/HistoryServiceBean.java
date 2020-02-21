package history;

import users.UserEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@Stateless
public class HistoryServiceBean implements HistoryService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<QueryEntity> getQueries(UserEntity user) {
        return entityManager.createNamedQuery("history.findByUser", QueryEntity.class)
                .setParameter("user", user).getResultStream()
                .collect(Collectors.toList());
    }

    @Override
    public boolean addQuery(@NotNull QueryEntity query) {
        query = new QueryEntity(null, query.getUser(), query.getX(), query.getY(), query.getR(), query.getResult());

        final QueryEntity last = entityManager.createNamedQuery("history.findByUserDesc", QueryEntity.class)
                .setParameter("user", query.getUser()).setMaxResults(1)
                .getResultStream().findAny().orElse(null);

        if (last != null
                && Double.compare(last.getX(), query.getX()) == 0
                && Double.compare(last.getY(), query.getY()) == 0
                && Double.compare(last.getR(), query.getR()) == 0) {
            return false;
        }

        try {
            entityManager.persist(query);
            entityManager.flush();
        } catch (PersistenceException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    @Override
    public boolean clear(UserEntity user) {
        try {
            return entityManager.createNamedQuery("history.deleteByUser")
                    .setParameter("user", user).executeUpdate() < 1;
        } catch (PersistenceException e) {
            e.printStackTrace();
            return false;
        }
    }
}
