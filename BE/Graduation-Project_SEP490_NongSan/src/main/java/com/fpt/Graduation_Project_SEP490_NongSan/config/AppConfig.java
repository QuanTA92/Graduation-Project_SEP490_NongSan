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

                        .requestMatchers(HttpMethod.GET, "/vnpay-payment").permitAll()

                        //product for household
                        .requestMatchers(HttpMethod.POST, "/api/product/add").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.PUT, "/api/product/update/**").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.DELETE, "/api/product/delete/**").hasAnyRole("ADMIN", "HOUSEHOLD")

                        .requestMatchers(HttpMethod.GET, "/api/product/household/get").hasRole("HOUSEHOLD")

                        //cart for trader
                        .requestMatchers("/api/cart/**").hasRole("TRADER")



                        // manager categories and subcategories for admin
                        //categories
                        .requestMatchers(HttpMethod.POST, "/api/categories/add").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/update/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/delete/**").hasRole("ADMIN")
                        //subcategories
                        .requestMatchers(HttpMethod.POST, "/api/subcategories/add/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/subcategories/update/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/subcategories/delete/**").hasRole("ADMIN")
                        //categoriesAndSubcategories
                        .requestMatchers(HttpMethod.POST, "/api/categoriesAndSubcategories/add").hasRole("ADMIN")


                        //price monitoring for Household and Admin
                        .requestMatchers(HttpMethod.GET, "/api/priceMonitoring/**").hasAnyRole("ADMIN", "HOUSEHOLD")

                        // get orders
                        // orders for trader
                        .requestMatchers(HttpMethod.GET, "/api/orders/trader/**").hasRole("TRADER")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/trader/**").hasRole("TRADER")
                        // orders for admin
                        .requestMatchers(HttpMethod.GET, "/api/orders/admin/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/orders/admin/**").hasRole("ADMIN")
                        // orders for household
                        .requestMatchers(HttpMethod.GET, "/api/orders/household/**").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/household/**").hasRole("HOUSEHOLD")

                        // wallet for household
                        .requestMatchers(HttpMethod.POST, "/api/wallet/add").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.PUT, "/api/wallet/update").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.DELETE, "/api/wallet/delete").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.GET, "/api/wallet/getForAccountHouseHold").hasRole("HOUSEHOLD")
                        .requestMatchers(HttpMethod.GET, "/api/wallet/checkWallet").hasRole("HOUSEHOLD")
                        // get wallet for admin
                        .requestMatchers(HttpMethod.GET, "/api/wallet/get").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/wallet/get/**").hasRole("ADMIN")


                        .requestMatchers(HttpMethod.GET, "/api/users/get/**").hasRole("ADMIN")

                        //user
                        .requestMatchers(HttpMethod.GET, "/auth/role").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/users/update").authenticated()

                        // blog for admin
                        .requestMatchers(HttpMethod.POST, "/api/blog/add").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/blog/update/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/blog/delete/**").hasRole("ADMIN")

                        //carousel for admin
                        .requestMatchers(HttpMethod.POST, "/api/carousel/add").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/carousel/update/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/carousel/delete/**").hasRole("ADMIN")

                        //dashboard
                        .requestMatchers(HttpMethod.GET, "/api/dashboard/admin").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/dashboard/household").hasRole("HOUSEHOLD")



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
