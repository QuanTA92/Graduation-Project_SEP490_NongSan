package com.fpt.Graduation_Project_SEP490_NongSan.exception;

public class NotFoundException extends RuntimeException {
    private static final long serialVersionUID = 5617542433839394135L;

    public NotFoundException(final String message) {
        super(message);
    }
}
