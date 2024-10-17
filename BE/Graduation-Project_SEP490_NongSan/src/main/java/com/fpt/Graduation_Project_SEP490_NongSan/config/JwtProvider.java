package com.fpt.Graduation_Project_SEP490_NongSan.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
public class JwtProvider {

    private static final SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    public static String generateToken(Authentication auth) {
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        String roles = populateAuthorities(authorities);

        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 86400000)) // 1 day expiration
                .claim("email", auth.getName())
                .claim("authorities", roles)
                .signWith(key)
                .compact();
    }

    public static String getEmailFromToken(String token) {
        try {
            token = token.substring(7); // Remove "Bearer " part

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.get("email", String.class);
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT token has expired");
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Invalid JWT token: " + e.getMessage());
        }
    }

    private static String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auth = new HashSet<>();
        for (GrantedAuthority ga : authorities) {
            auth.add(ga.getAuthority());
        }
        return String.join(",", auth);
    }
}