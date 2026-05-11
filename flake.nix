{
  description = "CraftPlan - Minecraft-style project planning";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f {
        pkgs = import nixpkgs { inherit system; };
      });
    in
    {
      devShells = forAllSystems ({ pkgs }: {
        default = pkgs.mkShell {
          buildInputs = [ pkgs.nodejs_22 ];
          shellHook = ''
            ln -sfnT ${self.packages.${pkgs.system}.default}/lib/node_modules node_modules
          '';
        };
        # For headless demo recording: chromium drives the page frame-by-frame
        # via CDP; ffmpeg stitches the captured PNGs into MP4.
        record = pkgs.mkShell {
          inputsFrom = [ self.devShells.${pkgs.system}.default ];
          buildInputs = [ pkgs.chromium pkgs.ffmpeg ];
        };
      });

      packages = forAllSystems ({ pkgs }: {
        default = pkgs.buildNpmPackage {
          pname = "craftplan";
          version = "0.1.0";
          src = ./.;
          npmDepsHash = "sha256-l4An40qC4a6cVEx2eFd2BIGR15lh0SRZ0A94Jk3z0j0=";
          dontNpmBuild = true;
          installPhase = ''
            mkdir -p $out/{lib,bin}
            cp -r node_modules server.js public package.json $out/lib/
            cat > $out/bin/craftplan <<EOF
            #!${pkgs.bash}/bin/bash
            exec ${pkgs.nodejs_22}/bin/node $out/lib/server.js "\$@"
            EOF
            chmod +x $out/bin/craftplan
          '';
        };
      });
    };
}
