package com.projetJEE.projetJEE.config;

import com.projetJEE.projetJEE.entities.Agent.TypeTache;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.stereotype.Component;

@Component
@ReadingConverter
@WritingConverter
public class StringToTypeTacheConverter implements Converter<String, TypeTache> {
    @Override
public TypeTache convert(String source) {
    if (source == null) return null;
    for (TypeTache t : TypeTache.values()) {
        if (t.name().equalsIgnoreCase(source)) {
            return t;
        }
    }
    return null; // ou throw exception
}

}