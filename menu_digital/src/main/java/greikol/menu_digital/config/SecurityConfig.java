package greikol.menu_digital.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration 
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(_ -> {
                var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                corsConfig.setAllowedOriginPatterns(java.util.List.of("*"));
                corsConfig.setAllowedMethods(java.util.List.of("*"));
                corsConfig.setAllowedHeaders(java.util.List.of("*"));
                corsConfig.setAllowCredentials(true);
                return corsConfig;
            }))
            .csrf(AbstractHttpConfigurer::disable)
            .formLogin(form -> form
                .disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize

                //Permiso para la api de autenticación
                .requestMatchers("/api/auth/**").permitAll()

                //Permiso para la api de productos 
                .requestMatchers("/api/productos/**").permitAll()

                //Permiso para la api de categorias
                .requestMatchers("/api/categorias/**").permitAll()

                //Permiso para la api de usuarios
                .requestMatchers("/api/usuarios/**").permitAll()

                //Permiso para la api de mesas y órdenes (actualizar endpoint)
                .requestMatchers("/api/mesas-ordenes/**").permitAll()

                //Permiso para la api de reservas
                .requestMatchers("/api/reservas/**").permitAll()

                //Permiso para la api de pedidos
                .requestMatchers("/api/pedidos/**").permitAll()

                //Permiso para la api de pagos
                .requestMatchers("/api/pagos/**").permitAll()

                //Permiso para la api de carritos
                .requestMatchers("/api/carritos/**").permitAll()

                .anyRequest().authenticated()
            );
              return http.build();
    }
    
}