import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

const sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({
        // optional, default to http://localhost:4318/v1/traces
        url: 'http://localhost:4318/v1/traces',
        // optional
        headers: {},
    }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            // optional, default to http://localhost:4318/v1/metrics
            url: 'http://localhost:4318/v1/metrics',
            // optional
            headers: {},
        }),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
    resource: new Resource({
            [ATTR_SERVICE_NAME]: 'blackjack',
            [ATTR_SERVICE_VERSION]: '1.0.0',
    }),
});

sdk.start();