# Eyjafjallajökull 2010 Volcanic Ash Transport Simulator — V3

This version integrates:
- MapLibre GL JS globe map
- Open-Meteo Historical Weather API as the atmospheric data source
- downloaded regular atmospheric grid + local interpolation
- spherical Earth advection
- pressure-level wind converted from speed/direction to U/V
- geopotential height for pressure-surface altitude
- pressure/temperature-dependent air density
- Reynolds-number drag + Cunningham correction
- gravitational settling
- stochastic turbulent dispersion
- Smoluchowski-style aggregation/coagulation approximation
- concentration grid in kg/m³
- dry deposition and rain washout hooks
- London / Paris / Frankfurt aviation alert panels
- ICAO concentration ranges as configurable alert thresholds
- eruption/plume height control, locked after simulation start
- source mass and particle-size distribution interfaces

## Scientific architecture

The atmospheric carrier flow is not solved by the browser. The model uses
the historical meteorological field supplied by Open-Meteo and solves the
ash parcel transport on top of that field. This is a Lagrangian stochastic
dispersion model.

For a full research-grade model, replace/upgrade parameterizations after
validation against published Eyjafjallajökull studies.

## Open-Meteo

The project uses the Historical Weather API `/v1/archive` and pressure-level
variables. Pressure levels do NOT have globally fixed geometric altitudes.
The API's `geopotential_height_*hPa` is used for altitude-aware interpolation.

The browser should NOT call the API once per particle. Instead:

1. `tools/download_open_meteo_grid.py`
2. downloads a regular grid in batches from Open-Meteo
3. saves compact JSON
4. browser performs local 4-D interpolation

## First run

```bash
python -m pip install requests numpy
python tools/download_open_meteo_grid.py
```

This creates:

```text
data/atmosphere/open_meteo_grid.json
```

Then serve the project from a local HTTP server:

```bash
python -m http.server 8080
```

Open:

http://localhost:8080/

Do NOT open `index.html` directly with `file://`.

## Important scientific note

The default eruption height is 8,000 m ASL for the initial explosive phase,
based on official/research reports. The actual eruption height varied strongly
through time, so the model stores the default as a documented scenario
parameter rather than claiming one constant height represented the whole
eruption.

The slider changes the source injection top before starting. Once Start is
pressed, source height and other scenario controls are locked until Reset.

## Data files

No fake atmospheric field is used in V3.
If the Open-Meteo download has not been performed, the UI reports that the
atmospheric grid is missing instead of silently using synthetic weather.
