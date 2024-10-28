package com.fpt.Graduation_Project_SEP490_NongSan.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class AppConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.sessionManagement(managent->managent.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(Authorizae->Authorizae

                        .requestMatchers(HttpMethod.POST, "/api/product/add").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.PUT, "/api/product/update/**").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.DELETE, "/api/product/delete/**").hasAnyRole("ADMIN", "HOUSEHOLD")

                        .requestMatchers(HttpMethod.GET, "/auth/role").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/users/update").authenticated()

                        .anyRequest().permitAll())

                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
                .csrf(csrf->csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));
        return http.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        return null;
    }
}
