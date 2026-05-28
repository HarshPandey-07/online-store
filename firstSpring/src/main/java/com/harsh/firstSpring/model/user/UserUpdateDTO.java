package com.harsh.firstSpring.model.user;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String username;
    private String email;
    private Integer roleId;
}
