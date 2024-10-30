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

                        //product for household
                        .requestMatchers(HttpMethod.POST, "/api/product/add").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.PUT, "/api/product/update/**").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.DELETE, "/api/product/delete/**").hasAnyRole("ADMIN", "HOUSEHOLD")


                        //cart for trader
                        .requestMatchers("/api/cart/**").hasRole("TRADER")


                        // manager categories and subcategories for admin
                        //categories
                        .requestMatchers(HttpMethod.POST, "/api/categories/add").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/update/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/delete/**").hasAnyRole("ADMIN")
                        //subcategories
                        .requestMatchers(HttpMethod.POST, "/api/subcategories/add/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/subcategories/update/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/subcategories/delete/**").hasAnyRole("ADMIN")
                        //categoriesAndSubcategories
                        .requestMatchers(HttpMethod.POST, "/api/categoriesAndSubcategories/add").hasRole("ADMIN")


                        //user
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
