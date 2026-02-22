{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "nanocraft-dev";

  buildInputs = with pkgs; [
    nodejs_20          
    nodePackages.typescript      
    python311
    python311Packages.pip
    python311Packages.virtualenv
  ];

  shellHook = ''
    echo ""
    echo "  NanoCraft dev shell (NixOS)"
    echo "  ─────────────────────────────────────────────"
    echo "  Node  : $(node --version)"
    echo "  Python: $(python3 --version)"
    echo ""
    echo "  Frontend  →  cd frontend && npm install && npm run dev"
    echo "  Backend   →  cd backend  && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload"
    echo ""

    # Activate backend virtualenv automatically if it exists
    if [ -f "backend/.venv/bin/activate" ]; then
      source backend/.venv/bin/activate
      echo "  (Backend virtualenv activated)"
    fi
  '';
}
