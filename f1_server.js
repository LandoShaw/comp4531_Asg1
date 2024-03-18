// Landon Odishaw-Dyck SID#201682898
// Web III Assignment 1 

const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const supaUrl = 'https://cgsmvcmhbmmgvprycefa.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnc212Y21oYm1tZ3ZwcnljZWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0NDM4MjYsImV4cCI6MjAyNjAxOTgyNn0.HGbpJ4CB3tNj_KvhRViM3a-9RhH_pPhS2aimD7_7fO8';
const supabase = supa.createClient(supaUrl, supaAnonKey);

app.get('/api/seasons', async (req, res) => {
    const {data, error} = await supabase
    .from('seasons')
    .select();
    res.send(data);
});

app.get('/api/circuits', async (req, res) => {
    const {data, error} = await supabase
    .from('circuits')
    .select();
    res.send(data);
});

app.get('/api/circuits/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('circuits')
    .select()
    .eq('circuitRef', req.params.ref);
    if (data.length === 0 ) {
        res.send({"message": "Did not find the requested data"}); 
    }
    else {
        res.send(data);
    }
});

app.get('/api/seasons/:year', async (req, res) => {
    const {data, error} = await supabase
    .from('seasons')
    .select()
    .eq('year', req.params.year);
    if (data.length === 0 ) {
        res.send({"message": "Did not find the requested data"}); 
    }
    else {
        res.send(data);
    }
});

app.get('/api/constructors', async (req, res) => {
    const {data, error} = await supabase
    .from('constructors')
    .select();
    res.send(data);
});

app.get('/api/constructors/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('constructors')
    .select()
    .eq('constructorRef', req.params.ref);
    if (data.length === 0 ) {
        res.send({"message": "Did not find the requested data"}); 
    }
    else {
        res.send(data);
    }
});

app.get('/api/drivers', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select();
    res.send(data);
});

app.get('/api/drivers/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select()
    .eq('driverRef', req.params.ref);
    if (data.length === 0 ) {
        res.send({"message": "Did not find the requested data"}); 
    }
    else {
        res.send(data);
    }
});

app.get('/api/drivers/search/:substring', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select()
        .ilike('surname', `${req.params.substring}%`)
        .order('surname', { ascending: true } );
    if (data.length === 0 ) {
        res.send({"message": "Did not find the requested data"}); 
    }
    else {
        res.send(data);
    }
});

app.get('/api/drivers/race/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select('drivers (driverId, driverRef, number, code, forename, surname, dob, nationality, url)')
        .eq('raceId', req.params.raceId)
        .order('drivers (surname)', { ascending: true } );
    if (data.length === 0 ) {
        res.send({"message": "Did not find the requested data"}); 
    }
    else {
        res.send(data);
    }
});

app.get('/api/races/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select('circuits(name, location, country)')
        .eq('raceId', req.params.raceId);
        if (data.length === 0 ) {
            res.send({"message": "Did not find the requested data"}); 
        }
        else {
            res.send(data);
        }
});

app.get('/api/races/season/:year', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select()
        .eq('year', req.params.year)
        .order('round', { ascending: true } );
        if (data.length === 0 ) {
            res.send({"message": "Did not find the requested data"}); 
        }
        else {
            res.send(data);
        }
});

app.get('/api/races/season/:year/:round', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select()
        .eq('year', req.params.year)
        .eq('round', req.params.round);
        if (data.length === 0 ) {
            res.send({"message": "Did not find the requested data"}); 
        }
        else {
            res.send(data);
        }
});

app.get('/api/races/circuits/:circuitRef', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select(`*, circuits!inner()`)        
        .eq('circuits.circuitRef', req.params.circuitRef);
        if (data.length === 0 ) {
            res.send({"message": "Did not find the requested data"}); 
        }
        else {
            res.send(data);
        }
});

app.get('/api/races/circuits/:circuitRef/season/:start/:end', async (req, res) => {
    if (req.params.start > req.params.end ) {
        res.json({"message": "Start year is greater than end year"}); 
        return
    }
    const { data, error } = await supabase
        .from('races')
        .select(`*, circuits!inner()`)        
        .eq('circuits.circuitRef', req.params.circuitRef)
        .gte('year', req.params.start)
        .lte('year', req.params.end);
    res.send(data); 
});

app.get('/api/results/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select(
            'resultId, number, grid, position, positionText, positionOrder, points, laps, time, milliseconds, fastestLap, rank, fastestLapTime, fastestLapSpeed, statusId, drivers (driverRef, code, forename, surname), races (name, round, year, date), constructors (name, constructorRef, nationality)')        
        .eq('raceId', req.params.raceId)
        .order('grid', { ascending: true } );
        if (data.length === 0 ) {
            res.send({"message": "Did not find the requested data"}); 
        }
        else {
            res.send(data);
        } 
});

app.get('/api/results/driver/:driverRef', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select(`*, drivers!inner()`)
        .eq('drivers.driverRef', req.params.driverRef);
        if (data.length === 0 ) {
            res.send({"message": "Did not find the requested data"}); 
        }
        else {
            res.send(data);
        } 
});

app.get('/api/results/driver/:driverRef/seasons/:start/:end', async (req, res) => {
    if (req.params.start > req.params.end ) {
        res.json({"message": "Start year is greater than end year"}); 
        return
    }
    const { data, error } = await supabase
        .from('results')
        .select(`*, drivers!inner(), races!inner()`)
        .eq('drivers.driverRef', req.params.driverRef)
        .gte('races.year', req.params.start)
        .lte('races.year', req.params.end);
    res.send(data); 
});

app.get('/api/qualifying/:raceId', async (req, res) => {
    const { data, error } = await supabase
        .from('qualifying')
        .select('qualifyId, number, position, q1, q2, q3, drivers (driverRef, code, forename, surname), races (name, round, year, date), constructors (name, constructorRef, nationality)')
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true } );
        if (data.length === 0 ) {
            res.send({"message": "Did not find the requested data"}); 
        }
        else {
            res.send(data);
        }
});

app.get('/api/standings/:raceId/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('driverStandings')
        .select('driverStandingsId, raceId, points, position, positionText, wins, drivers (driverRef, code, forename, surname)')
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true } );
        if (data.length === 0 ) {
            res.send({"message": "Did not find the requested data"}); 
        }
        else {
            res.send(data);
        }
});

app.get('/api/standings/:raceId/constructors', async (req, res) => {
    const { data, error } = await supabase
        .from('constructorStandings')
        .select('constructorStandingsId, raceId, points, position, positionText, wins, constructors (name, constructorRef, nationality)')
        .eq('raceId', req.params.raceId)
        .order('position', { ascending: true } );
        if (data.length === 0 ) {
            res.send({"message": "Did not find the requested data"}); 
        }
        else {
            res.send(data);
        }
});
