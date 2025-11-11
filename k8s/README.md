# Kubernetes deployment notes for node-app

This folder contains manifests for deploying the Node app. Below are steps and recommendations to set environment variables (ConfigMap for non-sensitive values and Secret for sensitive values) and deploy using Docker Hub images.

1) Non-sensitive env vars (already present):
- `k8s/configmap.yaml` contains non-sensitive variables (e.g. `VITE_API_URL`, `VITE_APP_NAME`). The `Deployment` mounts this ConfigMap via `envFrom`.

2) Sensitive env vars (new):
- `k8s/secret.yaml` (this file) contains placeholders for sensitive values like `DATABASE_URL`, `JWT_SECRET`, and `API_KEY`.

   DO NOT commit real secrets. Instead, either:

   - Edit `k8s/secret.yaml` locally and replace placeholder values (not recommended for repos), OR
   - Create the secret at deploy time (recommended):

```bash
# Example (from CI or your workstation):
kubectl create namespace node-app --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret generic node-app-secrets \
  --namespace node-app \
  --from-literal=DATABASE_URL="$DATABASE_URL" \
  --from-literal=JWT_SECRET="$JWT_SECRET" \
  --from-literal=API_KEY="$API_KEY"
```

3) Deployment changes:
- `k8s/deployment.yaml` was updated to include the Secret reference (`node-app-secrets`) in `envFrom` so both ConfigMap and Secret are available to the container.

4) Docker Hub image:
- The `Deployment` currently uses the image `populardigitalai/node-app:latest`. If you want to use your own Docker Hub image, update `spec.template.spec.containers[0].image` to `YOUR_DOCKERHUB_USERNAME/node-app:tag`.

5) Deploy (dry-run first):

```bash
# Validate manifests
kubectl apply -f k8s/configmap.yaml --namespace node-app --dry-run=client
kubectl apply -f k8s/secret.yaml --namespace node-app --dry-run=client
kubectl apply -f k8s/deployment.yaml --namespace node-app --dry-run=client

# Apply for real
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
```

6) Private Docker Hub repos:
- If your image is hosted in a private Docker Hub repo, create an image pull secret and reference it in `spec.imagePullSecrets` in the `Deployment`.

7) Next steps / validations:
- After applying, run `kubectl get pods -n node-app` and `kubectl logs` to verify the application reads environment variables as expected.
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
