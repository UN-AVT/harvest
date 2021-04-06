

// Cartesian coordinates
H.gg.prototype.coord_cartesian = function (x) {
    this.x = x;
    return this;
};

// Cartesian coordinates with fixed "aspect ratio"
H.gg.prototype.coord_fixed = function (x) {
    this.x = x;
    return this;
};

// Cartesian coordinates with x and y flipped
H.gg.prototype.coord_flip = function (x) {
    this.x = x;
    return this;
};

// Map projections
H.gg.prototype.coord_map = function (x) {
    this.x = x;
    return this;
};

// Map projections
H.gg.prototype.coord_quickmap = function (x) {
    this.x = x;
    return this;
};

// Polar coordinates
H.gg.prototype.coord_polar = function (x) {
    this.x = x;
    return this;
};

// Transformed Cartesian coordinate system
H.gg.prototype.coord_trans = function (x) {
    this.x = x;
    return this;
};