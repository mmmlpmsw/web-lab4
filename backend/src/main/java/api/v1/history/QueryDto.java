package api.v1.history;

public class QueryDto {

    public final double x, y, r;
    public final boolean result;

    public QueryDto(double x, double y, double r, boolean result) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.result = result;
    }
}
