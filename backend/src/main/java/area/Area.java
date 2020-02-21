package area;

import javax.ejb.Local;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Local
public interface Area extends Serializable {

    boolean checkPoint(
            @DecimalMin(value = "-5", inclusive = false) @DecimalMax(value = "5", inclusive = false)
            @NotNull double x,
            @DecimalMin(value = "-3", inclusive = false) @DecimalMax(value = "5", inclusive = false)
            @NotNull double y,
            @DecimalMin(value = "-5", inclusive = false) @DecimalMax(value = "5", inclusive = false)
            @NotNull double r
    );
}
