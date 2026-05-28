package com.harsh.firstSpring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.harsh.firstSpring.entity.User;
import com.harsh.firstSpring.model.user.UserPrincipal;
import com.harsh.firstSpring.repository.UserRepo;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username);
        if(user == null)
            throw new UsernameNotFoundException("User not found");

        return new UserPrincipal(user);
    }
}
