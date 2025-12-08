package com.projetJEE.projetJEE.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.*;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions customConversions() {
        List<Object> converters = new ArrayList<>();
        converters.add(new StringToTypeTacheConverter());
        return new MongoCustomConversions(converters);
    }

    @Bean
    public MappingMongoConverter mappingMongoConverter(
            MongoDatabaseFactory databaseFactory,
            MongoCustomConversions customConversions) throws Exception {
        
        DbRefResolver dbRefResolver = new DefaultDbRefResolver(databaseFactory);
        MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, new MongoMappingContext());
        converter.setCustomConversions(customConversions);
        converter.afterPropertiesSet();
        return converter;
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoDatabaseFactory databaseFactory, MappingMongoConverter converter) {
        return new MongoTemplate(databaseFactory, converter);
    }
}