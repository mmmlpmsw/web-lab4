package history;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import users.UserEntity;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity(name = "history")
@NamedQuery(name = "history.findByUser", query = "from history where user = :user order by id asc")
@NamedQuery(name = "history.findByUserDesc", query = "from history where user = :user order by id desc")
@NamedQuery(name = "history.deleteByUser", query = "delete from history where user = :user")
public class QueryEntity implements Serializable {

    @Id @SequenceGenerator(name = "query_id_seq")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "query_id_seq")
    private final Long id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private final UserEntity user;

    private final double x, y, r;

    private final boolean result;

    public QueryEntity() {
        id = null;
        user = null;
        x = y = r = 0;
        result = false;
    }

    public QueryEntity(Long id, UserEntity user, double x, double y, double r, boolean result) {
        this.id = id;
        this.user = user;
        this.x = x;
        this.y = y;
        this.r = r;
        this.result = result;
    }

    public Long getId() {
        return id;
    }

    public UserEntity getUser() {
        return user;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getR() {
        return r;
    }

    public boolean getResult() {
        return result;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        final QueryEntity that = (QueryEntity) o;
        return Double.compare(that.x, x) == 0 &&
                Double.compare(that.y, y) == 0 &&
                Double.compare(that.r, r) == 0 &&
                result == that.result &&
                Objects.equals(id, that.id) &&
                Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, x, y, r, result);
    }
}
