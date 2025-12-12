package com.projetJEE.projetJEE.exceptions;

public class PlanningException extends RuntimeException {
    private final String reason;

    public PlanningException(String message, String reason) {
        super(message);
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }
}

