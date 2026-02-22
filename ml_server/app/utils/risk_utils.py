import scipy.stats as stats

BEST_THRESHOLD = 0.35 

def risk_category(prob):
    if prob < BEST_THRESHOLD:
        return "Low Risk"
    elif prob < 0.75:
        return "Moderate Risk"
    else:
        return "High Risk"

def confidence_interval(prob):
    ci_lower, ci_upper = stats.t.interval(
        0.95,
        1,
        loc=prob,
        scale=0.01
    )
    return round(float(ci_lower), 4), round(float(ci_upper), 4)