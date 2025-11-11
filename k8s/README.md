Kubernetes manifests for the sample-app

Files:
- `namespace.yaml`  : Namespace `sample-app`
- `deployment.yaml` : Deployment with 2 replicas (placeholder image)
- `service.yaml`    : ClusterIP service mapping port 80 -> container 5173
- `ingress.yaml`    : Ingress configured for host `massimo.global`

Quick customize:
- The `deployment.yaml` uses the Docker Hub image:

```yaml
image: populardigitalai/sample-app:latest
```

- To use a different tag (recommended for releases), update the tag portion, e.g.
	`populardigitalai/sample-app:v1.2.3`.
- The ingress is intentionally configured without TLS/SSL in this repo. If you prefer
	to run with HTTPS later, you can add TLS and cert-manager configuration separately.

Apply to cluster:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml -n sample-app
kubectl apply -f k8s/service.yaml -n sample-app
kubectl apply -f k8s/ingress.yaml -n sample-app
```

Or apply the whole folder:

```bash
kubectl apply -R -f k8s/
```
